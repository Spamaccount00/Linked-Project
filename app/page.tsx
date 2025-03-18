import { InputForm } from "@/components/input-form"
import { DataTable } from "@/components/data-table"
import { AgentStatus } from "@/components/agent-status"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900">
            <span className="text-blue-600">Lead</span> Generation Dashboard
          </h1>
          <p className="text-center text-gray-500 mt-2">Generate, manage, and automate your lead generation process</p>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-8">
          <section className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Input Parameters</h2>
            </div>
            <InputForm />
          </section>

          <section className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Lead Data</h2>
            </div>
            <DataTable />
          </section>

          <section className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Background Agent & Status Updates</h2>
            </div>
            <AgentStatus />
          </section>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-gray-500">© 2025 Lead Generation Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

