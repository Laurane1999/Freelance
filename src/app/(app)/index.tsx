import { MarketplaceView } from '@/components/marketplace-view';

/**
 * Home tab (docs/16_NAVIGATION): the marketplace of services. Clients browse and
 * hire; freelancers see all listings. All screen-to-screen movement happens via
 * the bottom tab bar, so there are no navigation buttons here.
 */
export default function HomeScreen() {
  return <MarketplaceView title="Marketplace" />;
}
