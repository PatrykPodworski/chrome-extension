import { getSessions } from "../services/stateManager";

export const handleInstallation = async () => {
  const sessions = await getSessions();
  if (sessions.length === 0) {
    // This is a fresh install, no need to do anything as getSessions returns empty array
    console.log("Extension installed - initialized with empty sessions");
  }
};
