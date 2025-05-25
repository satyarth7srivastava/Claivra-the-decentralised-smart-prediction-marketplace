"use client"
import axios from 'axios'; 
import { getContract } from '../bc-utils/utils';
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

interface Prediction {
  _id: string;
  quizID: string;
  quizName: string;
  quizDescription: string;
  minBetAmt: number;
  maxBetAmt: number;
  quizOptions: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
  approvalStatus: string;
}

interface PredictionTableProps {
  predictions: Prediction[];
}


export function PredictionTable({ predictions = [] }: PredictionTableProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  const handleAction = async (type: "approve" | "reject", prediction: Prediction) => {
  try {
    if (type === "approve") {
      //blockchain related code
      const contract = await getContract();
      contract.appvoreRequest(prediction.quizID);

      await axios.post(`/api/quizes/updateStatus`, {
        quizID: prediction._id,
        status: "approved",
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("scrollToPredictionTable", "true");
      window.location.reload(); // This will trigger a full reload


      toast.success(`Approved prediction "${prediction.quizName}" from user ${prediction.owner}`);
    } else if (type === "reject") {

      const contract = await getContract();
      contract.rejectRequest(prediction.quizID);

      console.log("Quiz ID to reject:", prediction._id, prediction.quizID, prediction.quizName);
      await axios.delete(`/api/quizes/deleteQuiz?id=${prediction._id}`);
      localStorage.setItem("scrollToPredictionTable", "true");
      window.location.reload(); // This will trigger a full reload


      toast.success(`Rejected and deleted prediction "${prediction.quizName}" from user ${prediction.owner}`);
    }
    setSelectedPrediction(null); 
  } catch (error) {
    console.log(error);
    toast.error("An error occurred while processing the prediction.");
  }
};


  const pendingPredictions = predictions.filter(pred => pred.approvalStatus === "pending");

  useEffect(() => {
  const shouldScroll = localStorage.getItem("scrollToPredictionTable");
  if (shouldScroll) {
    const el = document.getElementById("predictionTable");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    localStorage.removeItem("scrollToPredictionTable"); // Clear the flag
  }
}, []);

  return (
    <div className="w-full overflow-auto" id='predictionTable'>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPredictions.map(prediction => (
                  <TableRow key={prediction._id} onClick={() => setSelectedPrediction(prediction)} className="cursor-pointer hover:bg-gray-800">
                    <TableCell>{prediction.owner}</TableCell>
                    <TableCell>{prediction.quizID}</TableCell>
                    <TableCell>{prediction.quizName}</TableCell>
                    <TableCell>{prediction.quizDescription}</TableCell>
                    <TableCell>{new Date(prediction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(prediction.updatedAt).toLocaleTimeString()}</TableCell>
                    <TableCell className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleAction("approve", prediction)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="hover:bg-red-700" onClick={() => handleAction("reject", prediction)}>
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
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingPredictions.slice(0, 6).map(prediction => (
            <TableRow key={prediction._id} onClick={() => setSelectedPrediction(prediction)} className="cursor-pointer">
              <TableCell>{prediction.owner}</TableCell>
              <TableCell>{prediction.quizID}</TableCell>
              <TableCell>{prediction.quizName}</TableCell>
              <TableCell>{prediction.quizDescription}</TableCell>
              <TableCell>{new Date(prediction.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(prediction.updatedAt).toLocaleTimeString()}</TableCell>
              <TableCell className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleAction("approve", prediction)}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="hover:bg-red-700" onClick={() => handleAction("reject", prediction)}>
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedPrediction} onOpenChange={() => setSelectedPrediction(null)}>
        <DialogContent className="border-none max-w-lg bg-[#1f1f1f] text-white">
          <DialogHeader>
            <DialogTitle>{selectedPrediction?.quizName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p><strong>User ID:</strong> {selectedPrediction?.owner}</p>
            <p><strong>Prediction ID:</strong> {selectedPrediction?.quizID}</p>
            <p><strong>Date:</strong> {new Date(selectedPrediction?.createdAt!).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(selectedPrediction?.updatedAt!).toLocaleTimeString()}</p>
            <p><strong>Description:</strong></p>
            <p>{selectedPrediction?.quizDescription}</p>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="destructive" className="hover:bg-red-700" onClick={() => handleAction("reject", selectedPrediction!)}>
                Reject
              </Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleAction("approve", selectedPrediction!)}>
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
