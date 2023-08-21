import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 */
const PollingWorkflow = DefineWorkflow({
  callback_id: "polling_workflow",
  title: "Start a poll",
  description: "Start a poll in a selected channel",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: [],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */
const inputForm = PollingWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Start a poll",
    submit_label: "Start poll",
    interactivity: PollingWorkflow.inputs.interactivity,
    fields: {
      elements: [{
        name: "channel",
        title: "Channel to send poll to",
        type: Schema.slack.types.channel_id,
        default: PollingWorkflow.inputs.channel,
      }, {
        name: "poll_question",
        title: "Question to poll",
        type: Schema.types.string,
        long: true,
      }, {
        name: "option_1",
        title: "Option 1",
        type: Schema.slack.types.date,
      }, {
        name: "option_2",
        title: "Option 2",
        type: Schema.slack.types.user_id,
      }, {
        name: "option_3",
        title: "Option 3",
        type: Schema.types.string,
        enum: [
          "Welcome to",
          "Dreamforce",
          "2023",
        ],
      }],
      required: [
        "channel",
        "poll_question",
        "option_1",
        "option_2",
        "option_3",
      ],
    },
  },
);

export default PollingWorkflow;
