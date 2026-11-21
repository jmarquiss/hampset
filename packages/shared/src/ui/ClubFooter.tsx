import { club } from '../club';
import scorpion from '../logo/scorpion-white.svg';
import { Footer } from './Footer';

/** The shared club footer used by the site and member app. */
export function ClubFooter() {
  return (
    <Footer
      logo={scorpion}
      aside={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href="/privacy" className="hover:text-white">
            Privacy policy
          </a>
          <a href="/terms" className="hover:text-white">
            Terms of service
          </a>
        </div>
      }
    >
      © {club.name}
    </Footer>
  );
}
