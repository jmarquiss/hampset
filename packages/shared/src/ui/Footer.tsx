import { club } from '../club';
import scorpion from '../logo/scorpion-white.svg';
import { Container } from './Container';

/** The shared club footer used by the site and member app. */
export function Footer() {
  return (
    <footer className="bg-brand text-sm text-accent">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-6">
        <span className="flex items-center gap-3">
          <img src={scorpion} alt="" className="h-7 w-auto" />
          <span>© {club.name}</span>
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href="/privacy" className="hover:text-white">
            Privacy policy
          </a>
          <a href="/terms" className="hover:text-white">
            Terms of service
          </a>
        </div>
      </Container>
    </footer>
  );
}
