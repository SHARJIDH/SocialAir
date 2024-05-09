/* eslint-disable react/display-name */
import {
  DefaultStreamChatGenerics,
  ReactionSelector,
  ReactionSelectorProps,
  useChannelStateContext,
  useMessageContext,
} from 'stream-chat-react';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export const customReactionOptions = [
  { type: 'runner', Component: () => <>🏃🏼</>, name: 'Runner' },
  { type: 'sun', Component: () => <>🌞</>, name: 'Sun' },
  { type: 'star', Component: () => <>🤩</>, name: 'Star' },
  { type: 'confetti', Component: () => <>🎉</>, name: 'Confetti' },
  { type: 'howdy', Component: () => <>🤠</>, name: 'Howdy' },
];

const CustomReactionSelectorWrapper = forwardRef<
  HTMLDivElement,
  ReactionSelectorProps<DefaultStreamChatGenerics>
>((props, ref) => {
  const divRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => divRef.current as HTMLDivElement);

  return (
    <div ref={divRef}>
      <CustomReactionSelector {...props} />
    </div>
  );
});

const CustomReactionSelector: React.FC<ReactionSelectorProps<DefaultStreamChatGenerics>> = (
  props
) => {
  const {
    message: { own_reactions: ownReactions = [], id: messageId },
  } = useMessageContext('CustomReactionSelector');
  const { channel } = useChannelStateContext('CustomReactionSelector');

  const handleReaction = useCallback(
    async (reactionType: any, event: any) => {
      const hasReactedWithType = (ownReactions ?? []).some(
        (reaction) => reaction.type === reactionType
      ) ?? false;
      if (hasReactedWithType) {
        await channel.deleteReaction(messageId, reactionType);
        return;
      }
      await channel.sendReaction(messageId, { type: reactionType });
    },
    [channel, ownReactions, messageId]
  );

  return (
    <ReactionSelector
      {...props}
      handleReaction={handleReaction}
      reactionOptions={customReactionOptions}
    />
  );
};
CustomReactionSelector.displayName = 'CustomReactionSelector';
export default CustomReactionSelectorWrapper;