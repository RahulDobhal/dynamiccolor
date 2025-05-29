import { useEffect } from "react";
import {
  useThreadManager,
  useThreadListManager,
  ThemeProvider,
} from "@thesysai/genui-sdk";
import {
  Container,
  SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
  ThreadContainer,
  MobileHeader,
  ScrollArea,
  Composer,
  NewChatButton,
  ThreadList,
} from "@crayonai/react-ui/Shell";
import { ChatProvider } from "@crayonai/react-core";
import "@crayonai/react-ui/styles/index.css";
import ChatComponents from "./ChatComponents";

export const Chat = () => {
  const threadListManager = useThreadListManager({
    fetchThreadList: async () => [],
    deleteThread: async () => {},
    updateThread: async (t) => t,
    onSwitchToNew: async () => {},
    onSelectThread: async () => {},
    createThread: async () => {
      return {
        id: "1",
        threadId: "1",
        title: "New Thread",
        createdAt: new Date(),
      };
    },
  });

  const threadManager = useThreadManager({
    threadListManager,
    loadThread: async () => [message],
    onUpdateMessage: async () => {},
  });

  useEffect(() => {
    threadListManager.selectThread("1");
  }, []);

  // return (
  //   <C1Chat
  //     threadManager={threadManager}
  //     threadListManager={threadListManager}
  //     theme={{
  //       theme: {
  //         // Colors
  //         backgroundFills: "rgba(28, 28, 28, 1)",
  //         brandElFills: "rgba(255, 255, 255, 1)",
  //         brandElHoverFills: "rgba(255, 255, 255, 0.8)",
  //         containerFills: "rgba(43, 43, 43, 1)",
  //         overlayFills: "rgba(0, 0, 0, 0.4)",
  //         sunkFills: "rgba(0, 0, 0, 0.2)",
  //         containerHoverFills: "rgba(255, 255, 255, 0.1)",
  //         dangerFills: "rgba(217, 45, 32, 0.1)",
  //         successFills: "rgba(7, 148, 85, 0.1)",
  //         strokeDefault: "rgba(255, 255, 255, 0.06)",
  //         strokeInteractiveEl: "rgba(255, 255, 255, 0.12)",
  //         strokeInteractiveElHover: "rgba(255, 255, 255, 0.4)",
  //         strokeInteractiveElSelected: "rgba(255, 255, 255, 1)",
  //         brandText: "rgba(0, 0, 0, 1)",
  //         brandSecondaryText: "rgba(255, 255, 255, 0.4)",
  //         primaryText: "rgba(255, 255, 255, 1)",
  //         secondaryText: "rgba(255, 255, 255, 0.6)",
  //         disabledText: "rgba(255, 255, 255, 0.2)",
  //         dangerText: "rgba(253, 162, 155, 1)",
  //         successText: "rgba(117, 224, 167, 1)",
  //         linkText: "rgba(255, 255, 255, 1)",
  //         infoText: "rgba(125, 179, 247, 1)",
  //         chatContainerBg: "rgba(25, 25, 25, 1)",
  //         chatAssistantResponseBg: "rgba(41, 41, 41, 1)",
  //         chatUserResponseBg: "rgba(255, 255, 255, 1)",
  //         chatAssistantResponseText: "rgba(255, 255, 255, 1)",
  //         chatUserResponseText: "rgba(25, 25, 25, 1)",

  //         // Layout
  //         spacing0: "0px",
  //         spacing3xs: "2px",
  //         spacing2xs: "4px",
  //         spacingXs: "6px",
  //         spacingS: "8px",
  //         spacingM: "12px",
  //         spacingL: "18px",
  //         spacingXl: "24px",
  //         spacing2xl: "36px",
  //         spacing3xl: "48px",
  //         rounded0: "0px",
  //         rounded3xs: "4px",
  //         rounded2xs: "8px",
  //         roundedXs: "10px",
  //         roundedS: "12px",
  //         roundedM: "20px",
  //         roundedL: "20px",
  //         roundedXl: "24px",
  //         rounded2xl: "28px",
  //         rounded3xl: "32px",
  //         rounded4xl: "48px",
  //         roundedFull: "999px",
  //         roundedClickable: "999px",

  //         // Typography
  //         fontPrimary: "Figtree 400 14px/20px",
  //         fontTitle: "Figtree 500 14px/20px",
  //         fontTitleMedium: "Figtree 500 16px/24px",
  //         fontTitleSmall: "Figtree 500 14px/20px",
  //         fontBody: "Figtree 400 14px/18px",
  //         fontBodyMedium: "Figtree 400 16px/24px",
  //         fontBodySmall: "Figtree 400 14px/20px",
  //         fontBodyHeavy: "Figtree 600 16px/24px",
  //         fontBodySmallHeavy: "Figtree 600 14px/20px",
  //         fontBodyLink: "Figtree 500 14px/18px",
  //         fontLabel: "Figtree 400 12px/16px",
  //         fontLabelHeavy: "Figtree 500 12px/16px",
  //         fontLabelSmall: "Figtree 400 10px/16px",
  //         fontLabelSmallHeavy: "Figtree 500 10px/16px",
  //         fontLabelExtraSmall: "Figtree 400 8px/12px",
  //         fontLabelExtraSmallHeavy: "Figtree 500 8px/12px",
  //         fontLabelLarge: "Figtree 400 12px/16px",
  //         fontLabelLargeHeavy: "Figtree 500 12px/16px",
  //         fontLabelMedium: "Figtree 400 10px/16px",
  //         fontLabelMediumHeavy: "Figtree 600 10px/16px",
  //         fontHeadingLarge: "Figtree 600 28px/36px",
  //         fontHeadingMedium: "Figtree 600 24px/32px",
  //         fontHeadingSmall: "Figtree 600 18px/24px",

  //         // Effects
  //         shadowS: "rgba(0, 0, 0, 0.04)",
  //         shadowM: "rgba(0, 0, 0, 0.04)",
  //         shadowL: "rgba(0, 0, 0, 0.08)",
  //         shadowXl: "rgba(0, 0, 0, 0.1)",
  //       },
  //     }}
  //   />
  // );
  return (
    <ThemeProvider
      theme={{
        // Colors
        backgroundFills: "var(--tone-78)",
        brandElFills: "var(--tone-95)",
        brandElHoverFills: "var(--tone-88)",
        containerFills: "var(--tone-3)",
        overlayFills: "var(--tone-98)",
        elevatedFills: "var(--tone-16)",
        sunkFills: "var(--tone-12)",
        containerHoverFills: "var(--tone-16)",
        dangerFills: "rgba(217, 45, 32, 0.1)",
        successFills: "rgba(7, 148, 85, 0.1)",
        strokeDefault: "var(--tone-8)",
        strokeInteractiveEl: "var(--tone-12)",
        strokeInteractiveElHover: "var(--tone-16)",
        strokeInteractiveElSelected: "var(--tone-n)",
        brandText: "var(--tone-22)",
        brandSecondaryText: "var(--tone-16)",
        primaryText: "var(--tone-95)",
        secondaryText: "var(--tone-n73)",
        disabledText: "var(--tone-n55)",
        dangerText: "rgba(253, 162, 155, 1)",
        successText: "rgba(117, 224, 167, 1)",
        linkText: "rgba(255, 255, 255, 1)",
        infoText: "rgba(125, 179, 247, 1)",
        chatContainerBg: "var(--tone-2)",
        chatAssistantResponseBg: "var(--tone-5)",
        chatUserResponseBg: "rgba(255, 255, 255, 1)",
        chatAssistantResponseText: "var(--tone-98)",
        chatUserResponseText: "rgba(25, 25, 25, 1)",

        // Layout
        spacing0: "0px",
        spacing3xs: "2px",
        spacing2xs: "4px",
        spacingXs: "6px",
        spacingS: "8px",
        spacingM: "12px",
        spacingL: "18px",
        spacingXl: "24px",
        spacing2xl: "36px",
        spacing3xl: "48px",
        rounded0: "0px",
        rounded3xs: "4px",
        rounded2xs: "8px",
        roundedXs: "10px",
        roundedS: "12px",
        roundedM: "20px",
        roundedL: "20px",
        roundedXl: "24px",
        rounded2xl: "28px",
        rounded3xl: "32px",
        rounded4xl: "48px",
        roundedFull: "999px",
        roundedClickable: "999px",

        // Typography
        fontPrimary: "Figtree 400 14px/20px",
        fontTitle: "Figtree 500 14px/20px",
        fontTitleMedium: "Figtree 500 16px/24px",
        fontTitleSmall: "Figtree 500 14px/20px",
        fontBody: "Figtree 400 14px/18px",
        fontBodyMedium: "Figtree 400 16px/24px",
        fontBodySmall: "Figtree 400 14px/20px",
        fontBodyHeavy: "Figtree 600 16px/24px",
        fontBodySmallHeavy: "Figtree 600 14px/20px",
        fontBodyLink: "Figtree 500 14px/18px",
        fontLabel: "Figtree 400 12px/16px",
        fontLabelHeavy: "Figtree 500 12px/16px",
        fontLabelSmall: "Figtree 400 10px/16px",
        fontLabelSmallHeavy: "Figtree 500 10px/16px",
        fontLabelExtraSmall: "Figtree 400 8px/12px",
        fontLabelExtraSmallHeavy: "Figtree 500 8px/12px",
        fontLabelLarge: "Figtree 400 12px/16px",
        fontLabelLargeHeavy: "Figtree 500 12px/16px",
        fontLabelMedium: "Figtree 400 10px/16px",
        fontLabelMediumHeavy: "Figtree 600 10px/16px",
        fontHeadingLarge: "Figtree 600 28px/36px",
        fontHeadingMedium: "Figtree 600 24px/32px",
        fontHeadingSmall: "Figtree 600 18px/24px",

        // Effects
        shadowS: "rgba(0, 0, 0, 0.04)",
        shadowM: "rgba(0, 0, 0, 0.04)",
        shadowL: "rgba(0, 0, 0, 0.08)",
        shadowXl: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <ChatProvider
        threadListManager={threadListManager}
        threadManager={threadManager}
      >
        <Container logoUrl={""} agentName="Crayon">
          <SidebarContainer>
            <SidebarHeader />
            <SidebarContent>
              <NewChatButton />
              <SidebarSeparator />
              <ThreadList />
            </SidebarContent>
          </SidebarContainer>
          <ThreadContainer>
            <MobileHeader />
            <ScrollArea>
              <ChatComponents />
            </ScrollArea>
            <Composer />
          </ThreadContainer>
        </Container>
      </ChatProvider>
    </ThemeProvider>
  );
};

const message = {
  id: "1",
  role: "assistant" as const,
  content:
    "<content>{\n  &quot;component&quot;: {\n    &quot;component&quot;: &quot;Card&quot;,\n    &quot;props&quot;: {\n      &quot;children&quot;: [\n        {\n          &quot;component&quot;: &quot;CardHeader&quot;,\n          &quot;props&quot;: {\n            &quot;title&quot;: &quot;Component Showcase&quot;,\n            &quot;subtitle&quot;: &quot;Demonstration of various UI components&quot;\n          }\n        },\n        {\n          &quot;component&quot;: &quot;TextContent&quot;,\n          &quot;props&quot;: {\n            &quot;textMarkdown&quot;: &quot;Welcome to our component showcase! Below you&#39;ll find examples of different UI components.&quot;\n          }\n        },\n        {\n          &quot;component&quot;: &quot;Tabs&quot;,\n          &quot;props&quot;: {\n            &quot;children&quot;: [\n              {\n                &quot;value&quot;: &quot;inputs&quot;,\n                &quot;trigger&quot;: {\n                  &quot;text&quot;: &quot;Input Components&quot;,\n                  &quot;icon&quot;: {\n                    &quot;component&quot;: &quot;Icon&quot;,\n                    &quot;props&quot;: {\n                      &quot;name&quot;: &quot;input&quot;\n                    }\n                  }\n                },\n                &quot;content&quot;: [\n                  {\n                    &quot;component&quot;: &quot;Form&quot;,\n                    &quot;props&quot;: {\n                      &quot;name&quot;: &quot;demo-form&quot;,\n                      &quot;children&quot;: [\n                        {\n                          &quot;label&quot;: &quot;Text Input&quot;,\n                          &quot;children&quot;: {\n                            &quot;component&quot;: &quot;Input&quot;,\n                            &quot;props&quot;: {\n                              &quot;name&quot;: &quot;text-input&quot;,\n                              &quot;placeholder&quot;: &quot;Enter text...&quot;\n                            }\n                          }\n                        },\n                        {\n                          &quot;label&quot;: &quot;Select Option&quot;,\n                          &quot;children&quot;: {\n                            &quot;component&quot;: &quot;Select&quot;,\n                            &quot;props&quot;: {\n                              &quot;name&quot;: &quot;select-demo&quot;,\n                              &quot;placeholder&quot;: &quot;Choose an option&quot;,\n                              &quot;children&quot;: [\n                                {\n                                  &quot;component&quot;: &quot;SelectItem&quot;,\n                                  &quot;props&quot;: {\n                                    &quot;value&quot;: &quot;1&quot;,\n                                    &quot;children&quot;: &quot;Option 1&quot;\n                                  }\n                                },\n                                {\n                                  &quot;component&quot;: &quot;SelectItem&quot;,\n                                  &quot;props&quot;: {\n                                    &quot;value&quot;: &quot;2&quot;,\n                                    &quot;children&quot;: &quot;Option 2&quot;\n                                  }\n                                }\n                              ]\n                            }\n                          }\n                        }\n                      ],\n                      &quot;buttons&quot;: {\n                        &quot;component&quot;: &quot;ButtonGroup&quot;,\n                        &quot;props&quot;: {\n                          &quot;children&quot;: [\n                            {\n                              &quot;component&quot;: &quot;Button&quot;,\n                              &quot;props&quot;: {\n                                &quot;name&quot;: &quot;submit-btn&quot;,\n                                &quot;children&quot;: &quot;Submit&quot;,\n                                &quot;variant&quot;: &quot;primary&quot;\n                              }\n                            }\n                          ]\n                        }\n                      }\n                    }\n                  }\n                ]\n              },\n              {\n                &quot;value&quot;: &quot;display&quot;,\n                &quot;trigger&quot;: {\n                  &quot;text&quot;: &quot;Display Components&quot;\n                },\n                &quot;content&quot;: [\n                  {\n                    &quot;component&quot;: &quot;Accordion&quot;,\n                    &quot;props&quot;: {\n                      &quot;children&quot;: [\n                        {\n                          &quot;value&quot;: &quot;tags&quot;,\n                          &quot;trigger&quot;: {\n                            &quot;text&quot;: &quot;Tag Examples&quot;\n                          },\n                          &quot;content&quot;: [\n                            {\n                              &quot;component&quot;: &quot;TagBlock&quot;,\n                              &quot;props&quot;: {\n                                &quot;children&quot;: [\n                                  {\n                                    &quot;text&quot;: &quot;Active&quot;,\n                                    &quot;iconName&quot;: &quot;check-circle&quot;\n                                  },\n                                  {\n                                    &quot;text&quot;: &quot;Pending&quot;,\n                                    &quot;iconName&quot;: &quot;clock&quot;\n                                  }\n                                ]\n                              }\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  },\n                  {\n                    &quot;component&quot;: &quot;Table&quot;,\n                    &quot;props&quot;: {\n                      &quot;tableHeader&quot;: {\n                        &quot;rows&quot;: [\n                          {\n                            &quot;children&quot;: &quot;Name&quot;\n                          },\n                          {\n                            &quot;children&quot;: &quot;Status&quot;\n                          }\n                        ]\n                      },\n                      &quot;tableBody&quot;: {\n                        &quot;rows&quot;: [\n                          {\n                            &quot;children&quot;: [\n                              &quot;John Doe&quot;,\n                              &quot;Active&quot;\n                            ]\n                          }\n                        ]\n                      }\n                    }\n                  }\n                ]\n              },\n              {\n                &quot;value&quot;: &quot;charts&quot;,\n                &quot;trigger&quot;: {\n                  &quot;text&quot;: &quot;Charts&quot;\n                },\n                &quot;content&quot;: [\n                  {\n                    &quot;component&quot;: &quot;BarChart&quot;,\n                    &quot;props&quot;: {\n                      &quot;categoryKey&quot;: &quot;month&quot;,\n                      &quot;data&quot;: [\n                        {\n                          &quot;month&quot;: &quot;Jan&quot;,\n                          &quot;value&quot;: 30\n                        },\n                        {\n                          &quot;month&quot;: &quot;Feb&quot;,\n                          &quot;value&quot;: 45\n                        }\n                      ]\n                    }\n                  }\n                ]\n              }\n            ]\n          }\n        },\n        {\n          &quot;component&quot;: &quot;ListBlock&quot;,\n          &quot;props&quot;: {\n            &quot;items&quot;: [\n              {\n                &quot;title&quot;: &quot;List Item 1&quot;,\n                &quot;subtitle&quot;: &quot;Description&quot;,\n                &quot;decorativeIcon&quot;: {\n                  &quot;component&quot;: &quot;Icon&quot;,\n                  &quot;props&quot;: {\n                    &quot;name&quot;: &quot;arrow-right&quot;\n                  }\n                }\n              }\n            ]\n          }\n        },\n        {\n          &quot;component&quot;: &quot;Steps&quot;,\n          &quot;props&quot;: {\n            &quot;children&quot;: [\n              {\n                &quot;component&quot;: &quot;StepsItem&quot;,\n                &quot;props&quot;: {\n                  &quot;title&quot;: &quot;Step 1&quot;,\n                  &quot;details&quot;: {\n                    &quot;component&quot;: &quot;TextContent&quot;,\n                    &quot;props&quot;: {\n                      &quot;textMarkdown&quot;: &quot;First step description&quot;\n                    }\n                  }\n                }\n              }\n            ]\n          }\n        },\n        {\n          &quot;component&quot;: &quot;Callout&quot;,\n          &quot;props&quot;: {\n            &quot;variant&quot;: &quot;info&quot;,\n            &quot;title&quot;: &quot;Information&quot;,\n            &quot;description&quot;: &quot;This is an informational callout&quot;\n          }\n        }\n      ]\n    }\n  },\n  &quot;error&quot;: null\n}</content>",
};
