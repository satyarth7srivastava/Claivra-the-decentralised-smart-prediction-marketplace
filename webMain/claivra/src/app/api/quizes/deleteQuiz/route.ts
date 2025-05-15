import { NextResponse } from "next/server";
import connect from "@/config/connect";
import Quizes from "@/models/Quizes";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }
    await connect();
    const deletedQuiz = await Quizes.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: "An error occurred while deleting the quiz" }, { status: 500 });
  }
}
