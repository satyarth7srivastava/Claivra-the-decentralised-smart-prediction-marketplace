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

export function PredictionTable({ predictions = [] }: PredictionTableProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)

  const handleAction = (type: "approve" | "reject", prediction: Prediction) => {
    toast.success(
      `${type === "approve" ? "Approved" : "Rejected"} prediction "${prediction.title}" from user ${prediction.userId}`
    )
    setSelectedPrediction(null)
  }

  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Verify Predictions</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-transparent">All</Button>
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
                {predictions.map((prediction) => (
                  <TableRow key={prediction.id} onClick={() => setSelectedPrediction(prediction)} className="cursor-pointer hover:bg-gray-800">
                    <TableCell>{prediction.userId}</TableCell>
                    <TableCell>{prediction.id}</TableCell>
                    <TableCell>{prediction.title}</TableCell>
                    <TableCell>{prediction.date}</TableCell>
                    <TableCell>{prediction.time}</TableCell>
                    <TableCell className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => handleAction("approve", prediction)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="hover:bg-red-700"
                        onClick={() => handleAction("reject", prediction)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>

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
          {predictions.slice(0, 6).map((prediction) => (
            <TableRow key={prediction.id} onClick={() => setSelectedPrediction(prediction)} className="cursor-pointer">
              <TableCell>{prediction.userId}</TableCell>
              <TableCell>{prediction.id}</TableCell>
              <TableCell>{prediction.title}</TableCell>
              <TableCell>{prediction.date}</TableCell>
              <TableCell>{prediction.time}</TableCell>
              <TableCell className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => handleAction("approve", prediction)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="hover:bg-red-700"
                  onClick={() => handleAction("reject", prediction)}
                >
                  Reject
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
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="destructive"
                className="hover:bg-red-700"
                onClick={() => handleAction("reject", selectedPrediction!)}
              >
                Reject
              </Button>
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => handleAction("approve", selectedPrediction!)}
              >
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
