const HOOK_MODULES = ['UFICentralUpdates', 'UFIFeedbackTargets'];
const UPDATE_FEEDBACK_EVENT = 'update-feedback';
const DEFAULT_SUPPORTED_REACTIONS_COUNT = 6;
const REACTION_TYPE_ID_FIRE = 14;
const REACTION_TYPE_ID_PLANE = 15;

hookFacebookReactions();

// hooks into the React components that are responsible for Facebook Reactions
function hookFacebookReactions() {
  if(window.requireLazy) {
    window.requireLazy(HOOK_MODULES,
      (UFICentralUpdates, UFIFeedbackTargets) => {
        // listen for the event that updates the object used by Reactions
        UFICentralUpdates.subscribe(UPDATE_FEEDBACK_EVENT, onUpdateFeedback);
        
        // listen when a 'FeedbackTarget' is updated so we can modify its data
        function onUpdateFeedback(eventName, feedbackObj) {
          var supportedReactions = feedbackObj.feedbacktarget.supportedreactions;
          // to prevent an infinite callback loop, only send an update if the Reactions haven't been modified yet
          if(supportedReactions.length === DEFAULT_SUPPORTED_REACTIONS_COUNT) {
            supportedReactions.push(REACTION_TYPE_ID_FIRE); // inject the Thankful Reaction
            supportedReactions.push(REACTION_TYPE_ID_PLANE); // inject the Thankful Reaction
            feedbackObj.feedbacktarget.supportedreactions = supportedReactions; // reassign the supportedreactions
            UFICentralUpdates.inform(UPDATE_FEEDBACK_EVENT, feedbackObj); // update the 'FeedbackTarget' ???? PROFIT!!
          }
        }
      }
    );
  } else {
    console.log('Failed to inject Facebook Reactions hook.');
  }
}