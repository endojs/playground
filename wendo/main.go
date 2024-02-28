// This program is a full window terminal user interface for the endo pet daemon.
// In this prototype, it shows a dynamicly updated list of pet names in the
// user's primary profile inventory.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"os/exec"
	"slices"
	"sync"

	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"
)

func main() {
	var wg sync.WaitGroup
	defer wg.Wait()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	app := tview.NewApplication()

	tfatal := func(err error) {
		app.QueueEvent(tcell.NewEventError(err))
	}

	table := tview.NewTable()
	table.SetTitle("inventory")
	table.SetTitleAlign(tview.AlignLeft)
	table.SetBorder(true)

	wg.Add(1)
	go func() {
		defer wg.Done()
		cmd := exec.CommandContext(ctx, "endo", "list", "--follow", "--json")

		stdout, err := cmd.StdoutPipe()
		if err != nil {
			tfatal(err)
			return
		}

		stderr, err := cmd.StderrPipe()
		if err != nil {
			tfatal(err)
			return
		}

		if err := cmd.Start(); err != nil {
			tfatal(err)
			return
		}

		var rowNames []string
		decoder := json.NewDecoder(stdout)
		for decoder.More() {
			var change struct {
				Add    string `json:"add"`
				Remove string `json:"remove"`
				Value  struct {
					Type   string `json:"type"`
					Number string `json:"number"`
				} `json:"value"`
			}
			if err := decoder.Decode(&change); err != nil {
				tfatal(err)
				return
			}
			if change.Remove != "" {
				index, found := slices.BinarySearch(rowNames, change.Remove)
				if found {
					rowNames = slices.Delete(rowNames, index, index+1)
					app.QueueUpdateDraw(func() {
						table.RemoveRow(index)
					})
				}
			}
			if change.Add != "" {
				index, found := slices.BinarySearch(rowNames, change.Add)
				if !found {
					rowNames = slices.Insert(rowNames, index, change.Add)
					app.QueueUpdateDraw(func() {
						table.InsertRow(index)
						table.SetCell(index, 0, tview.NewTableCell(change.Add))
						table.SetCell(index, 1, tview.NewTableCell(change.Value.Type))
						table.SetCell(index, 2, tview.NewTableCell(change.Value.Number))
					})
				}
			}
		}

		errput, err := io.ReadAll(stderr)
		if err != nil {
			tfatal(err)
			return
		}

		err = cmd.Wait()
		if err != nil {
			tfatal(errors.New(string(errput)))
			return
		}
	}()

	table.SetSelectable(true, true)

	flex := tview.NewFlex()
	flex.SetDirection(0)
	flex.AddItem(table, 0, 1, true)
	modeline := tview.NewTextView()
	modeline.SetDynamicColors(true)
	modeline.SetText("[black:white]q[white:black]uit")
	modeline.SetTextAlign(tview.AlignRight)
	flex.AddItem(modeline, 1, 0, true)

	app.SetRoot(flex, true)
	app.EnableMouse(true)
	app.SetInputCapture(func(ev *tcell.EventKey) *tcell.EventKey {
		key := ev.Key()
		if key == tcell.KeyRune {
			if ev.Rune() == 'q' {
				app.Stop()
			}
		}
		return ev
	})

	if err := app.Run(); err != nil {
		panic(err)
	}
}
