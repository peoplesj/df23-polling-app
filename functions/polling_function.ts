import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const PollingFunctionDefinition = DefineFunction({
  callback_id: "polling_function",
  title: "Generate poll",
  description: "Generate poll",
  source_file: "functions/polling_function.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel ID",
      },
      poll_question: {
        type: Schema.types.string,
        description: "Question to ask",
      },
      option_1: {
        type: Schema.types.string,
        description: "Option 1",
      },
      option_2: {
        type: Schema.types.string,
        description: "Option 2",
      },
      option_3: {
        type: Schema.types.string,
        description: "Option 3",
      },
    },
    required: [
      "channel_id",
      "poll_question",
      "option_1",
      "option_2",
      "option_3",
    ],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  PollingFunctionDefinition,
  async ({ client, inputs }) => {
    try {
      const {
        channel_id,
        poll_question,
        option_1,
        option_2,
        option_3,
        interactivity,
      } = inputs;

      const blocks = [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text":
              `<@${interactivity?.interactor.id}> posed the following question:`,
          },
        },
        {
          "type": "divider",
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${poll_question}*`,
          },
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": `:one:  ${option_1}`,
            "emoji": true,
          },
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": `:two:  ${option_2}`,
            "emoji": true,
          },
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": `:three:  ${option_3}`,
            "emoji": true,
          },
        },
        {
          "type": "divider",
        },
        // Add the button here!
      ];

      // Post the poll in channel
      const msgResp = await client.chat.postMessage({
        channel: channel_id,
        blocks,
      });

      // Plant emojis to encourage measurable responses
      for (const reacji of ["one", "two", "three"]) {
        try {
          const res = await client.reactions.add({
            channel: msgResp.channel,
            timestamp: msgResp.message.ts,
            name: reacji,
          });

          if (!res.ok) throw new Error(res.error);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err) {
      return {
        error:
          `An error was encountered during poll generation: \`${err.message}\``,
      };
    }

    // IMPORTANT! Set `completed` to false in order to keep the interactivity
    // points (the approve/deny buttons) "alive"
    // We will set the function's complete state in the button handlers below.
    return { completed: false };
  },
);
