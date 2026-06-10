import { useAccount, useDisconnect } from 'wagmi';
import { getRabbykit } from '~/root';
import { Button } from './ui/button';

export default function WalletButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {isConnected ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        <Button onClick={() => getRabbykit()?.open()}>Connect</Button>
      )}
    </div>
  );
}
