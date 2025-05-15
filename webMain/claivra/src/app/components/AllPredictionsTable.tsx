"use client"

import { useEffect, useState } from "react"
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
import axios from "axios"

interface PredictionOption {
  optionID: number
  optionText: string
  totalBet?: number
}

interface Prediction {
  _id: string
  quizID : string,
  quizName: string
  quizDescription: string
  minBetAmt: string
  maxBetAmt: string
  quizOptions: PredictionOption[]
  owner: string
  createdAt: string
  approvalStatus: "approved" | "pending" | "rejected"
}

interface PredictionTableProps {
  predictions: Prediction[];
}


export default function AllPredictionsTable({ predictions }: { predictions: Prediction[] }) {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [newPrediction, setNewPrediction] = useState<Prediction>({
    _id: "",
    quizID: "",
    quizName: "",
    quizDescription: "",
    minBetAmt: "",
    maxBetAmt: "",
    quizOptions: [
      { optionID: 1, optionText: "" },
      { optionID: 2, optionText: "" }
    ],
    owner: "",
    createdAt : "", 
    approvalStatus :  "approved",
  })

  const fields = [
  { label: "Quiz Name", key: "quizName" },
  { label: "Quiz Description", key: "quizDescription" },
  { label: "Minimum Bet Amount", key: "minBetAmt" },
  { label: "Maximum Bet Amount", key: "maxBetAmt" },
  { label: "Owner", key: "owner" },
]

 useEffect(() => {
    setAllPredictions(predictions.filter((p) => p.approvalStatus === "approved"))
  }, [predictions])


  const handleAddOrEdit = async () => {
  const {
    quizName,
    quizDescription,
    minBetAmt,
    maxBetAmt,
    quizOptions,
    owner,
  } = newPrediction;

  if (!quizName || !quizDescription || !minBetAmt || !maxBetAmt || !owner) {
    toast.error("Please fill all fields");
    return;
  }

  if (
    quizOptions.length < 2 ||
    quizOptions.some((opt) => !opt.optionText.trim())
  ) {
    toast.error("At least 2 valid quiz options are required.");
    return;
  }

  const formattedOptions = quizOptions.map((opt, index) => ({
    optionID: index + 1,
    optionText: opt.optionText,
    totalBet: opt.totalBet ?? 0,
  }));

  const now = new Date();

  try {
    if (editingId) {
      // === Editing Existing Prediction ===
      const updatedPrediction: Prediction = {
          ...newPrediction,
          _id: editingId,
      };

      const res = await axios.put("/api/quizes/update", updatedPrediction);

      if (res.status !== 200) throw new Error("Update failed");

      setAllPredictions((prev) =>
        prev.map((p) =>
          p._id === editingId ? updatedPrediction : p
        )
      );
      toast.success(`Updated prediction "${quizName}"`);
    } else {
      // === Creating New Prediction ===
      const newEntry: Prediction = {
        ...newPrediction,
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: now.toISOString(),
        quizOptions: formattedOptions,
      };

      const response = await fetch("/api/quizes/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) throw new Error("Failed to add prediction");

      setAllPredictions((prev) => [...prev, newEntry]);
      localStorage.setItem("scrollToAllPredictionTable", "true");
      window.location.reload();
      toast.success(`Added prediction "${quizName}"`);
    }

    // Reset state
    setShowAddDialog(false);
    setEditingId(null);
    setNewPrediction({
      _id: "",
      quizID: "",
      quizName: "",
      quizDescription: "",
      minBetAmt: "",
      maxBetAmt: "",
      quizOptions: [
        { optionID: 1, optionText: "" },
        { optionID: 2, optionText: "" },
      ],
      owner: "",
      createdAt: "",
      approvalStatus: "approved",
    });
  } catch (error) {
    console.error("Prediction error:", error);
    toast.error(editingId ? "Error updating prediction" : "Error adding prediction");
  }
};


const handleDelete = async (predictionId: string) => {
  try {
    const res = await axios.delete(`/api/quizes/deleteQuiz?id=${predictionId}`);

    if (res.status !== 200) throw new Error("Delete failed");
    localStorage.setItem("scrollToAllPredictionTable", "true");
    window.location.reload();
    toast.success("Prediction deleted");
  } catch (error) {
    toast.error("Failed to delete prediction");
  }
};

   useEffect(() => {
  const shouldScroll = localStorage.getItem("scrollToAllPredictionTable");
  if (shouldScroll) {
    const el = document.getElementById("allPredictionTable");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    localStorage.removeItem("scrollToAllPredictionTable"); // Clear the flag
  }
}, []);

  return (
    <div className="w-full overflow-auto" id="allPredictionTable">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Predictions</h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setEditingId(null)
              setShowAddDialog(true)
            }}
            className="bg-transparent"
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
                  <TableRow className="hover:bg-transparent" >
                    <TableHead>User ID</TableHead>
                    <TableHead>Prediction ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPredictions.map((prediction) => (
                    <TableRow key={prediction._id}>
                      <TableCell>{prediction.owner}</TableCell>
                      <TableCell>{prediction.quizID}</TableCell>
                      <TableCell>{prediction.quizName}</TableCell>
                      <TableCell>{prediction.quizDescription}</TableCell>
                      <TableCell>{prediction.createdAt.split("T")[0] }</TableCell>
                      <TableCell>{prediction.createdAt.split("T")[1]?.split(".")[0]}</TableCell>
                      <TableCell className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          className="text-white hover:bg-gray-500"
                          onClick={() => {
                            setNewPrediction(prediction),
                            setEditingId(prediction._id)
                            setShowAddDialog(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="hover:bg-red-700"
                          onClick={() => handleDelete(prediction._id)}
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
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allPredictions.slice(0, 6).map((prediction) => (
            <TableRow
              key={prediction._id}
              onClick={() => setSelectedPrediction(prediction)}
              className="cursor-pointer"
            >
              <TableCell>{prediction.owner}</TableCell>
              <TableCell>{prediction.quizID}</TableCell>
              <TableCell>{prediction.quizName}</TableCell>
              <TableCell>{prediction.quizDescription}</TableCell>
              <TableCell>{prediction.createdAt.split("T")[0] }</TableCell>
              <TableCell>{prediction.createdAt.split("T")[1]?.split(".")[0]}</TableCell>
              <TableCell
                className="flex gap-2 justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  className="text-white hover:bg-gray-500"
                  onClick={() => {
                    setNewPrediction(prediction)
                    setEditingId(prediction._id)
                    setShowAddDialog(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="hover:bg-red-700"
                  onClick={() => handleDelete(prediction._id)}
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
            <DialogTitle>{selectedPrediction?.quizName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p><strong>User ID:</strong> {selectedPrediction?.owner}</p>
            <p><strong>Prediction ID:</strong> {selectedPrediction?._id}</p>
            <p><strong>Date:</strong> {selectedPrediction?.createdAt ? selectedPrediction.createdAt.split("T")[0] : "N/A"}</p>
            <p><strong>Time:</strong> {selectedPrediction?.createdAt ? selectedPrediction.createdAt.split("T")[1]?.split(".")[0] : "N/A"}</p>


            <p><strong>Description:</strong></p>
            <p>{selectedPrediction?.quizDescription}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Prediction Modal */}
      <Dialog open={showAddDialog} onOpenChange={(isOpen) => {
  setShowAddDialog(isOpen);
  if (!isOpen) {
    setEditingId(null);
    setNewPrediction({
      _id: "",
      quizID: "",
      quizName: "",
      quizDescription: "",
      minBetAmt: "",
      maxBetAmt: "",
      quizOptions: [
        { optionID: 1, optionText: "" },
        { optionID: 2, optionText: "" },
      ],
      owner: "",
      createdAt: "",
      approvalStatus: "approved",
    });
  }
}}>

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
            {fields.map(({ label, key }) => (
  <div key={key}>
    <label className="block mb-1">{label}</label>
    <input
      type="text"
      required
      className="w-full px-3 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
      placeholder={`Enter ${label}`}
      value={(newPrediction as any)[key]}
      onChange={(e) =>
        setNewPrediction((prev) => ({ ...prev, [key]: e.target.value }))
      }
    />
  </div>
))}


            {/* Quiz Options */}
            <div>
              <label className="block mb-1">Quiz Options</label>
              {newPrediction.quizOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    required
                    placeholder={`Option ${index + 1}`}
                    className="w-full px-3 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={option.optionText}
                    onChange={(e) => {
                      const updatedOptions = [...newPrediction.quizOptions]
                      updatedOptions[index].optionText = e.target.value
                      setNewPrediction((prev) => ({
                        ...prev,
                        quizOptions: updatedOptions
                      }))
                    }}
                  />
                  {index >= 2 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const updatedOptions = newPrediction.quizOptions.filter((_, i) => i !== index)
                        setNewPrediction((prev) => ({
                          ...prev,
                          quizOptions: updatedOptions.map((opt, i) => ({
                            ...opt,
                            optionID: i + 1
                          }))
                        }))
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                className="mt-2"
                onClick={() =>
                  setNewPrediction((prev) => ({
                    ...prev,
                    quizOptions: [
                      ...prev.quizOptions,
                      { optionID: prev.quizOptions.length + 1, optionText: "" },
                    ],
                  }))
                }
              >
                + Add Option
              </Button>
            </div>

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
