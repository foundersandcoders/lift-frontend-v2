"use client"

import { useState } from "react"
import StatementBuilder from "./components/StatementBuilder"
import StatementWizard from "./components/StatementWizard"
import type { Statement } from "../types/types"
import { Eye, EyeOff } from "lucide-react"
import { PreStatement } from "../types/types"

// For testing purposes, we'll hardcode a username here
// In a real application, this would come from a route parameter or user session
const USERNAME = "Eve"

export default function Home() {
  const [statements, setStatements] = useState<Statement[]>([])

  const handleAddStatement = (newStatement: PreStatement) => {
    const fullStatement: Statement = {
      ...newStatement,
      id: Date.now().toString(), // Generate an id (consider using a better id generator for production)
    };
    setStatements((prev) => [...prev, fullStatement]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Statement Builders for {USERNAME}</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Original Statement Builder</h2>
            <StatementBuilder onAddStatement={handleAddStatement} username={USERNAME} />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">New Statement Wizard</h2>
            <StatementWizard onComplete={handleAddStatement} username={USERNAME} />
          </div>
        </div>

        {statements.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Created Statements</h2>
            <div className="space-y-3">
              {statements.map((statement) => (
                <div
                  key={statement.id}
                  className="p-4 rounded-lg bg-gray-50 flex items-center justify-between group hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <span className="font-medium text-blue-600">{statement.subject}</span>{" "}
                    <span className="font-medium text-green-600">{statement.verb}</span>{" "}
                    <span className="font-medium text-yellow-600">{statement.object}</span>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600">
                    {statement.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

