"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Prediction {
  id: string
  userId: string
  title: string
  date: string
  time: string
  description: string
}

interface PredictionTableProps {
  predictions: Prediction[]
}

export default function AllPredictionsTable({ predictions = [] }: PredictionTableProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const [allPredictions, setAllPredictions] = useState(predictions)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [newPrediction, setNewPrediction] = useState<Prediction>({
    id: "",
    userId: "",
    title: "",
    date: "",
    time: "",
    description: "",
  })

  const handleAddOrEdit = () => {
    if (
      !newPrediction.id ||
      !newPrediction.userId ||
      !newPrediction.title ||
      !newPrediction.date ||
      !newPrediction.time
    ) {
      toast.error("Please fill all fields")
      return
    }

    if (editingId) {
      setAllPredictions((prev) =>
        prev.map((p) => (p.id === editingId ? newPrediction : p))
      )
      toast.success(`Updated prediction "${newPrediction.title}"`)
    } else {
      setAllPredictions((prev) => [...prev, newPrediction])
      toast.success(`Added prediction "${newPrediction.title}"`)
    }

    setNewPrediction({
      id: "",
      userId: "",
      title: "",
      date: "",
      time: "",
      description: "",
    })
    setEditingId(null)
    setShowAddDialog(false)
  }

  const handleDelete = (predictionId: string) => {
    setAllPredictions((prev) => prev.filter((p) => p.id !== predictionId))
    toast.success("Prediction deleted")
  }

  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Predictions</h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setEditingId(null)
              setNewPrediction({
                id: "",
                userId: "",
                title: "",
                date: "",
                time: "",
                description: "",
              })
              setShowAddDialog(true)
            }}
            className="bg-transparent " 
          >
            + Add Prediction
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-transparent">
                All
              </Button>
            </DialogTrigger>
            <DialogContent className="border-none max-w-5xl max-h-[80vh] overflow-y-auto bg-[#1f1f1f] text-white">
              <DialogHeader>
                <DialogTitle>All Prediction Requests</DialogTitle>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>User ID</TableHead>
                    <TableHead>Prediction ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPredictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell>{prediction.userId}</TableCell>
                      <TableCell>{prediction.id}</TableCell>
                      <TableCell>{prediction.title}</TableCell>
                      <TableCell>{prediction.date}</TableCell>
                      <TableCell>{prediction.time}</TableCell>
                      <TableCell className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          className="text-white hover:bg-gray-500"
                          onClick={() => {
                            setNewPrediction(prediction)
                            setEditingId(prediction.id)
                            setShowAddDialog(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="hover:bg-red-700"
                          onClick={() => handleDelete(prediction.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Top 6 Predictions */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>User ID</TableHead>
            <TableHead>Prediction ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allPredictions.slice(0, 6).map((prediction) => (
            <TableRow
              key={prediction.id}
              onClick={() => setSelectedPrediction(prediction)}
              className="cursor-pointer"
            >
              <TableCell>{prediction.userId}</TableCell>
              <TableCell>{prediction.id}</TableCell>
              <TableCell>{prediction.title}</TableCell>
              <TableCell>{prediction.date}</TableCell>
              <TableCell>{prediction.time}</TableCell>
              <TableCell
                className="flex gap-2 justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  className="text-white hover:bg-gray-500"
                  onClick={() => {
                    setNewPrediction(prediction)
                    setEditingId(prediction.id)
                    setShowAddDialog(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="hover:bg-red-700"
                  onClick={() => handleDelete(prediction.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Preview Modal */}
      <Dialog open={!!selectedPrediction} onOpenChange={() => setSelectedPrediction(null)}>
        <DialogContent className="border-none max-w-lg bg-[#1f1f1f] text-white">
          <DialogHeader>
            <DialogTitle>{selectedPrediction?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p><strong>User ID:</strong> {selectedPrediction?.userId}</p>
            <p><strong>Prediction ID:</strong> {selectedPrediction?.id}</p>
            <p><strong>Date:</strong> {selectedPrediction?.date}</p>
            <p><strong>Time:</strong> {selectedPrediction?.time}</p>
            <p><strong>Description:</strong></p>
            <p>{selectedPrediction?.description}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Prediction Modal */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#1f1f1f] text-white border-none max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Prediction" : "Add New Prediction"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddOrEdit()
            }}
            className="space-y-4"
          >
            {["userId", "id", "title", "date", "time", "description"].map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder={`Enter ${field}`}
                  value={(newPrediction as any)[field]}
                  onChange={(e) =>
                    setNewPrediction((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="flex justify-end">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {editingId ? "Update" : "Add"} Prediction
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
