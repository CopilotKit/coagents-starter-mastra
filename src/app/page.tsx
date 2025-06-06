"use client";

import { CatchAllActionRenderProps, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");

  // 🪁 Frontend Actions: https://docs.copilotkit.ai/guides/frontend-actions
  useCopilotAction({
    name: "setThemeColor",
    parameters: [{
      name: "themeColor",
      description: "The theme color to set. Make sure to pick nice colors.",
      required: true, 
    }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <YourMainContent themeColor={themeColor} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Popup Assistant",
          initial: "👋 Hi, there! You're chatting with an agent. This agent comes with a few tools to get you started.\n\nFor example you can try:\n- **Frontend Tools**: \"Set the theme to green\"\n- **Generative UI**: \"Get the weather in SF\"\n\nAs you interact with the agent, you'll see the UI update in real-time to reflect the agent's **state**, **tool calls**, and **progress**."
        }}
      />
    </main>
  );
}

function YourMainContent({ themeColor }: { themeColor: string }) {
  //🪁 Generative UI: https://docs.copilotkit.ai/coagents/generative-ui
  useCopilotAction({
    name: "*",
    render: (props: CatchAllActionRenderProps) => {
      const InfoBox = ({ title, content }: { title: string; content: any }) => (
        <div className="bg-black/30 p-3 rounded-xl">
          <h2 className="text-white text-sm mb-1">{title}</h2>
          <pre className="text-white text-sm overflow-auto max-h-32 font-mono">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      );

      return (
        <details style={{ backgroundColor: themeColor }} className="p-4 my-2 rounded-xl">
          <summary className="text-white cursor-pointer">
            {props.name} {props.status === "complete" ? "called!" : "executing..."}
          </summary>
          <div className="space-y-2 py-4">
            <div className="grid grid-cols-2 gap-2">
              <InfoBox title="Name" content={props.name} />
              <InfoBox title="Status" content={props.status} />
            </div>
            <InfoBox title="Input" content={props.args} />
            <InfoBox title="Output" content={props.result} />
            <InfoBox title="Full Details" content={props} />
          </div>
        </details>
      );
    },
  });

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="h-screen w-screen flex justify-center items-center flex-col transition-colors duration-300"
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Mastra</h1>
        <p className="text-gray-200 text-center italic mb-6">This is a demonstrative page, but it can be anything you want! 🪁</p>
      </div>
    </div>
  );
}
