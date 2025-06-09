const quizData = [
  {
    name: "Will Bitcoin cross $80K by December?",
    option: "Yes",
    amount: 120,
    date: "2025-06-09T10:15:00Z"
  },
  {
    name: "Will India win the ICC World Cup 2025?",
    option: "No",
    amount: 75,
    date: "2025-06-08T13:45:00Z"
  },
  {
    name: "Will Apple release Vision Pro 2 in 2025?",
    option: "Yes",
    amount: 200,
    date: "2025-06-07T09:30:00Z"
  },
  {
    name: "Will OpenAI launch GPT-5 by September?",
    option: "Yes",
    amount: 50,
    date: "2025-06-06T17:20:00Z"
  },
  {
    name: "Will Ethereum gas fees drop below 10 gwei?",
    option: "No",
    amount: 90,
    date: "2025-06-05T12:00:00Z"
  },
  {
    name: "Will there be a major tech IPO this year?",
    option: "Yes",
    amount: 110,
    date: "2025-06-04T14:50:00Z"
  },
  {
    name: "Will the next iPhone have a periscope lens?",
    option: "No",
    amount: 65,
    date: "2025-06-03T16:05:00Z"
  },
  {
    name: "Will AI-generated art win a major award?",
    option: "Yes",
    amount: 130,
    date: "2025-06-02T11:40:00Z"
  },
  {
    name: "Will SpaceX launch Starship successfully again?",
    option: "Yes",
    amount: 160,
    date: "2025-06-01T08:25:00Z"
  },
  {
    name: "Will Taylor Swift headline Glastonbury 2025?",
    option: "No",
    amount: 85,
    date: "2025-05-31T19:10:00Z"
  }
];

import quizImage from "@/../public/trump.png";



export default function UserHistory() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 w-full px-2 mb-10">
      <h1 className="font-semibold text-xl text-gray-800 px-6 pt-8 pb-2">
        Activity
      </h1>
      <table className="min-w-full table-auto text-sm">
        <thead className="text-gray-500 text-xs">
          <tr>
            <th className="font-light px-6 pt-6 pb-1 text-left">Quiz Name</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">
              Bet Option
            </th>
            <th className="font-light px-6 pt-6 pb-1 text-center">
              Bet Amount
            </th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
          {quizData.map((quiz, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 font-medium text-left flex items-center gap-3">
                <img
                  src={quizImage.src}
                  alt="event"
                  className="w-10 h-10 rounded-full"
                />
                {quiz.name}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-block px-2 py-1 rounded-full text-xs">
                  {quiz.option}
                </span>
              </td>
              <td className="px-6 py-4 text-center">${quiz.amount}</td>
              <td className="px-6 py-4 text-center">
                {new Date(quiz.date).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
