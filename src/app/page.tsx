import { ModeToggle } from '@/components/mode-toggle'
import { initialProfile } from '@/lib/initial-profile';

const Home = async () => {
  const profile = await initialProfile();
  return (
    <div>
      <ModeToggle />
    </div>
  )
}

export default Home;
