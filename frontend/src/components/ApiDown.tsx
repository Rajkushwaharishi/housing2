export default function ApiDown() {
  return (
    <div className="mx-auto my-20 max-w-xl rounded-2xl border border-line bg-white p-8 text-center">
      <h1 className="font-display text-2xl font-bold text-narmada-900">Can't reach the listings API</h1>
      <p className="mt-3 text-muted">
        Start the FastAPI server, then refresh this page:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-narmada-900 p-4 text-left text-sm text-narmada-100">
        {"cd backend\nuvicorn app.main:app --reload"}
      </pre>
    </div>
  );
}
