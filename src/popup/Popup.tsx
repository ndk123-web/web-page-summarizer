import { useState } from "react"
import '../index.css'

export default function Popup() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarStatus, setSidebarStatus] = useState("")

  const getPageText = async () => {
    setLoading(true)

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      chrome.tabs.sendMessage(tab.id!, { type : "GET_PAGE_TEXT"}, (response) => {
        console.log("Response from content script:", response)
        
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError)
          setText("Error: " + chrome.runtime.lastError.message)
          setLoading(false)
          return
        }
        
        if (response && response.text) {
          setText(response.text.slice(0, 500))
        } else {
          setText("No text found.")
        }
        setLoading(false)
      })
    } catch (error) {
      console.error("Error:", error)
      setText("Error extracting page text")
      setLoading(false)
    }
  }

  const injectSidebar = async () => {
    setSidebarStatus("Injecting...")
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (tab.id) {
      try {
        chrome.tabs.sendMessage(tab.id, {type : "INJECT_SIDEBAR"}, (response) => {
          console.log("Sidebar injection response:", response)
          if (response && response.status === "SIDEBAR_INJECTED") {
            setSidebarStatus("✓ Sidebar Active")
            setTimeout(() => setSidebarStatus(""), 2000)
          }
          else {
            setSidebarStatus("Failed to inject")
            setTimeout(() => setSidebarStatus(""), 2000)
          }
        })
      }
      catch(error) {
        console.error("Error injecting sidebar:", error)
        setSidebarStatus("Error")
        setTimeout(() => setSidebarStatus(""), 2000)
      }
    }
  }

  return (
    <div className="w-96 bg-white text-gray-900 flex flex-col h-auto rounded-lg shadow-2xl">
      {/* Header - Modern gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white mb-1">Web Summarizer</h1>
        <p className="text-blue-100 text-sm">Extract & summarize web content instantly</p>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4">
        {text ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Extracted Content</label>
              <div className="mt-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {text}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Ready to Extract</p>
            <p className="text-gray-500 text-sm mt-1">Click the button below to start</p>
          </div>
        )}
      </div>

      {/* Button Area */}
      <div className="px-6 pb-6 space-y-2">
        {/* Extract Text Button */}
        <button
          onClick={getPageText}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Extracting...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Extract Page Text</span>
            </>
          )}
        </button>

        {/* Sidebar Button */}
        <button 
          onClick={injectSidebar}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          {sidebarStatus ? (
            sidebarStatus
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Enable Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
