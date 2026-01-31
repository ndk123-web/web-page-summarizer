import { createRoot } from "react-dom/client";
import Sidebar from "../components/Sidebar";
import "../index.css";

export function mountSidebar() {
  // Check if sidebar is already mounted
  const existingRoot = document.getElementById("my-extension-sidebar-root");
  if (existingRoot) {
    console.log("Sidebar already mounted");
    return;
  }

  // Create container
  const container = document.createElement("div");
  container.id = "my-extension-sidebar-root";
  document.body.appendChild(container);

  // Mount React app
  const root = createRoot(container);
  root.render(<Sidebar />);

  console.log("Sidebar mounted successfully");
}
