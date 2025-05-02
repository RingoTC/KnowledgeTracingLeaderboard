"use client";

export default function SubmitPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Submit Your Model
      </h1>

      <div className="rounded-md border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Submission Guidelines
          </h2>
          
          <div className="space-y-4">
            <p>
              To submit your knowledge tracing model to the leaderboard, please follow these steps:
            </p>
            
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <span className="font-medium">Prepare Your Model:</span> Ensure your model implemented with the <a href="https://github.com/pykt-team/pykt-toolkit" className="text-blue-500 hover:text-blue-600">pykt-kit</a> framework.
              </li>
              <li>
                <span className="font-medium">Code Submission:</span> Provide a link to your code repository.
              </li>
              <li>
                <span className="font-medium">Contact Information:</span> Include your model name and a link to your publication if available.
              </li>
            </ol>
            <div className="mt-6">
              <h3 className="font-medium mb-2">Submit Your Results</h3>
              <p className="text-sm text-muted-foreground">
                Please send your submission to: <a href="#" className="text-blue-500 hover:text-blue-600">ringotc#outlook.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 