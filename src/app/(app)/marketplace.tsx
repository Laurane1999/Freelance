import { MarketplaceView } from '@/components/marketplace-view';

/**
 * Freelancer "Services" tab (docs/16_NAVIGATION): the freelancer's own listings
 * with the "+ New" publish action. Reached only from the bottom tab bar.
 */
export default function ServicesScreen() {
  return <MarketplaceView title="My Services" ownerOnly showCreate />;
}
