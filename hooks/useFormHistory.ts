"use client"

import { useState, useCallback, useRef } from "react"
import type { Form } from "../types/form"

interface HistoryState {
  past: Form[]
  present: Form
  future: Form[]
}

export function useFormHistory(initialForm: Form) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialForm,
    future: [],
  })

  const isUndoRedoAction = useRef(false)

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const pushToHistory = useCallback((newForm: Form) => {
    // Don't add to history if this is an undo/redo action
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false
      return
    }

    setHistory((prev) => {
      // Don't add to history if the form hasn't actually changed
      if (JSON.stringify(prev.present) === JSON.stringify(newForm)) {
        return prev
      }

      return {
        past: [...prev.past, prev.present].slice(-50), // Keep only last 50 states
        present: newForm,
        future: [], // Clear future when new action is performed
      }
    })
  }, [])

  const undo = useCallback(() => {
    if (!canUndo) return null

    isUndoRedoAction.current = true

    setHistory((prev) => {
      const previous = prev.past[prev.past.length - 1]
      const newPast = prev.past.slice(0, prev.past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      }
    })

    return history.past[history.past.length - 1]
  }, [canUndo, history.past])

  const redo = useCallback(() => {
    if (!canRedo) return null

    isUndoRedoAction.current = true

    setHistory((prev) => {
      const next = prev.future[0]
      const newFuture = prev.future.slice(1)

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      }
    })

    return history.future[0]
  }, [canRedo, history.future])

  const clearHistory = useCallback((newForm: Form) => {
    setHistory({
      past: [],
      present: newForm,
      future: [],
    })
  }, [])

  const getCurrentForm = useCallback(() => {
    return history.present
  }, [history.present])

  return {
    currentForm: history.present,
    canUndo,
    canRedo,
    undo,
    redo,
    pushToHistory,
    clearHistory,
    getCurrentForm,
  }
}
