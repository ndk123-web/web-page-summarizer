// Part of Options Page - Renders the settings UI for the extension and handles saving/loading configuration
import { useState, useEffect, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Moon, Sun, Save, Wifi, WifiOff } from "lucide-react"
import '../App.css' // Helper for Tailwind/Shadcn variables

function Options() {
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<"online" | "offline">("online")
  
  // Settings State
  const [provider, setProvider] = useState("openai")
  const [openaiApiKey, setOpenaiApiKey] = useState("")
  const [openaiModel, setOpenaiModel] = useState("gpt-4o")
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [deepseekApiKey, setDeepseekApiKey] = useState("")
  const [claudeApiKey, setClaudeApiKey] = useState("")
  
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434")
  const [ollamaModel, setOllamaModel] = useState("llama3")
  const [status, setStatus] = useState("")

  useEffect(() => {
    // Theme init
    const savedTheme = localStorage.getItem("extension-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialDark = savedTheme ? savedTheme === "dark" : prefersDark
    setIsDark(initialDark)
    
    // Apply class to html/body for full page theme
    if (initialDark) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }

    // Load Settings
    chrome.storage.sync.get(['provider', 'openaiApiKey', 'openaiModel', 'geminiApiKey', 'deepseekApiKey', 'claudeApiKey', 'ollamaUrl', 'ollamaModel'], (result) => {
        if (result.provider) setProvider(result.provider as string)
        if (result.openaiApiKey) setOpenaiApiKey(result.openaiApiKey as string)
        if (result.openaiModel) setOpenaiModel(result.openaiModel as string)
        if (result.geminiApiKey) setGeminiApiKey(result.geminiApiKey as string)
        if (result.deepseekApiKey) setDeepseekApiKey(result.deepseekApiKey as string)
        if (result.claudeApiKey) setClaudeApiKey(result.claudeApiKey as string)
        if (result.ollamaUrl) setOllamaUrl(result.ollamaUrl as string)
        if (result.ollamaModel) setOllamaModel(result.ollamaModel as string)
    })
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("extension-theme", newTheme ? "dark" : "light")
    if (newTheme) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
  }

  const handleSave = () => {
    chrome.storage.sync.set({
        provider: provider,
        openaiApiKey: openaiApiKey,
        openaiModel: openaiModel,
        geminiApiKey: geminiApiKey,
        deepseekApiKey: deepseekApiKey,
        claudeApiKey: claudeApiKey,
        ollamaUrl: ollamaUrl,
        ollamaModel: ollamaModel
    }, () => {
        setStatus("Settings saved successfully!")
        setTimeout(() => setStatus(""), 3000)
    })
  }

  return (
    <div className={`min-h-screen w-full transition-colors flex justify-center p-4 md:p-8 ${isDark ? 'bg-neutral-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className={`w-full max-w-2xl rounded-xl border shadow-lg overflow-hidden h-fit ${isDark ? 'bg-black border-neutral-800' : 'bg-white border-gray-200'}`}>
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
                <div>
                    <h1 className="text-2xl font-bold">Extension Settings</h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Configure your AI providers</p>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
                <button 
                    onClick={() => setActiveTab('online')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'online' ? (isDark ? 'text-white bg-neutral-900/50' : 'text-black bg-white') : (isDark ? 'text-gray-500 hover:text-gray-300 bg-neutral-950' : 'text-gray-500 hover:text-gray-700 bg-gray-50')}`}
                >
                    <Wifi className="w-4 h-4" /> 
                    Online (OpenAI)
                    {activeTab === 'online' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('offline')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'offline' ? (isDark ? 'text-white bg-neutral-900/50' : 'text-black bg-white') : (isDark ? 'text-gray-500 hover:text-gray-300 bg-neutral-950' : 'text-gray-500 hover:text-gray-700 bg-gray-50')}`}
                >
                    <WifiOff className="w-4 h-4" /> 
                    Offline (Ollama)
                    {activeTab === 'offline' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
                </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-6">
                {activeTab === 'online' ? (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-3">
                            <label className="text-sm font-medium">AI Provider</label>
                            <Select value={provider} onValueChange={setProvider}>
                                <SelectTrigger className={isDark ? "bg-neutral-900 border-neutral-800" : ""}>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent className={isDark ? "bg-neutral-900 border-neutral-800 text-white" : ""}>
                                    <SelectItem value="openai">OpenAI</SelectItem>
                                    <SelectItem value="gemini">Google Gemini</SelectItem>
                                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                                    <SelectItem value="claude">Anthropic Claude</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Select the AI provider you want to use.</p>
                        </div>
                        
                        {provider === 'openai' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                             <div className="space-y-3">
                                <label className="text-sm font-medium">Model Selection</label>
                                <Select value={openaiModel} onValueChange={setOpenaiModel}>
                                    <SelectTrigger className={isDark ? "bg-neutral-900 border-neutral-800" : ""}>
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent className={isDark ? "bg-neutral-900 border-neutral-800 text-white" : ""}>
                                        <SelectItem value="gpt-4o">GPT-4o (Most Capable)</SelectItem>
                                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fastest)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">OpenAI API Key</label>
                                <Input 
                                    type="password" 
                                    placeholder="sk-..." 
                                    value={openaiApiKey} 
                                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                                    className={isDark ? "bg-neutral-900 border-neutral-800" : ""}
                                />
                            </div>
                        </div>
                        )}

                        {provider === 'gemini' && (
                             <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-sm font-medium">Gemini API Key</label>
                                <Input 
                                    type="password" 
                                    placeholder="AIza..." 
                                    value={geminiApiKey} 
                                    onChange={(e) => setGeminiApiKey(e.target.value)}
                                    className={isDark ? "bg-neutral-900 border-neutral-800" : ""}
                                />
                            </div>
                        )}

                        {provider === 'deepseek' && (
                             <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-sm font-medium">DeepSeek API Key</label>
                                <Input 
                                    type="password" 
                                    placeholder="sk-..." 
                                    value={deepseekApiKey} 
                                    onChange={(e) => setDeepseekApiKey(e.target.value)}
                                    className={isDark ? "bg-neutral-900 border-neutral-800" : ""}
                                />
                            </div>
                        )}

                        {provider === 'claude' && (
                             <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-sm font-medium">Claude API Key</label>
                                <Input 
                                    type="password" 
                                    placeholder="sk-ant-..." 
                                    value={claudeApiKey} 
                                    onChange={(e) => setClaudeApiKey(e.target.value)}
                                    className={isDark ? "bg-neutral-900 border-neutral-800" : ""}
                                />
                            </div>
                        )}
                        
                        <div className="pb-2">
                             <p className="text-xs text-muted-foreground">Your key is stored securely in your browser's local sync storage and is never shared.</p>
                        </div>
                     </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                Ensure Ollama is running (`ollama serve`) and is accessible.
                            </p>
                         </div>

                         <div className="space-y-3">
                            <label className="text-sm font-medium">Ollama Server URL</label>
                             <Input 
                                placeholder="http://localhost:11434" 
                                value={ollamaUrl} 
                                onChange={(e) => setOllamaUrl(e.target.value)}
                                className={isDark ? "bg-neutral-900 border-neutral-800" : ""}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium">Model Name</label>
                             <Input 
                                placeholder="llama3" 
                                value={ollamaModel} 
                                onChange={(e) => setOllamaModel(e.target.value)}
                                className={isDark ? "bg-neutral-900 border-neutral-800" : ""}
                            />
                            <p className="text-xs text-muted-foreground">This exact model name must be pulled locally via `ollama pull {ollamaModel || '<model>'}`</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={`p-6 border-t flex justify-between items-center ${isDark ? 'border-neutral-800 bg-neutral-900/30' : 'border-gray-200 bg-gray-50/50'}`}>
                <div className={`text-sm font-medium transition-opacity duration-300 ${status ? 'opacity-100 text-emerald-500' : 'opacity-0'}`}>
                    {status}
                </div>
                <Button onClick={handleSave} className={isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}>
                    <Save className="w-4 h-4 mr-2" /> Save Settings
                </Button>
            </div>
        </div>
    </div>
  )
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Options />
    </StrictMode>
  );
}

export default Options;