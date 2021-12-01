import { Box } from 'grommet';
import { useChatStore } from '..';
import { observer } from 'mobx-react-lite';
import ChatSection from './ChatSection';

const RightSide = observer(() => {

  const chatStore = useChatStore()

  if (chatStore.showChat)
    return <ChatSection chat={chatStore}/>

  return (
  <div>
    <Box background="light-2">
      Top gamers
    </Box>
    <hr/>
    <Box background="light-2">
      News
    </Box>
  </div>
)
})

export default RightSide;