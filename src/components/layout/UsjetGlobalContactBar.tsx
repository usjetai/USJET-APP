import { Link } from "react-router-dom";
import { Gem } from "lucide-react";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import FooterSurpriseWrap from "./FooterSurpriseWrap";
import WefunderCovenantBridge from "../campaign/WefunderCovenantBridge";
import { ORIGIN_CS_ROUTE } from "../../lib/memberAccessLevel";
import ZelleFuelChip from "../fuel/ZelleFuelChip";
import GamingVrNavButton from "../gaming/GamingVrNavButton";
import SilentHangarAudioToggle from "../media/SilentHangarAudioToggle";
import { GLOBAL_BACKGROUND_BEAT_ENABLED } from "../../data/globalBackgroundBeat";

/** Fixed bottom strip — brand, status, revenue lanes, SOS / Customer Service. */
export default function UsjetGlobalContactBar() {
  return (
    <footer className="usjet-global-contact-bar" aria-label="USJET site status and quick links">
      <GlassEffectContainer className="usjet-global-contact-bar__shell liquid-glass-background glass-effect glass-effect--capsule glass-tint-cyan">
        <div className="usjet-global-contact-bar__row usjet-global-contact-bar__row--head">
          <div className="usjet-global-contact-bar__lead">
            <Link
              to="/"
              className="usjet-global-contact-bar__brand btn-glass glass-effect-interactive"
              aria-label="USJet.ai home"
            >
              <UsjetWordmark size="nav" glow />
            </Link>
            <div className="usjet-global-contact-bar__status">
              <span className="usjet-global-contact-bar__status-label">USJET System Active</span>
              <span className="usjet-global-contact-bar__ping" aria-hidden />
            </div>
          </div>

          <div className="usjet-global-contact-bar__support">
            <FooterSurpriseWrap chipId="sos">
              <Link to="/sos" className="usjet-global-contact-bar__sos btn-glass glass-effect-interactive">
                SOS
              </Link>
            </FooterSurpriseWrap>
            <FooterSurpriseWrap chipId="privacy">
              <Link
                to="/privacy"
                className="usjet-global-contact-bar__ops btn-glass glass-effect-interactive"
                aria-label="USJET privacy policy"
              >
                <span className="usjet-global-contact-bar__ops-label">Privacy</span>
              </Link>
            </FooterSurpriseWrap>
            <FooterSurpriseWrap chipId="cs">
              <Link
                to={ORIGIN_CS_ROUTE}
                className="usjet-global-contact-bar__cs btn-glass glass-effect-interactive glass-tint-cyan"
              >
                <span className="usjet-global-contact-bar__cs-label">Customer Service</span>
              </Link>
            </FooterSurpriseWrap>
          </div>
        </div>

        <nav
          className="usjet-global-contact-bar__row usjet-global-contact-bar__row--lanes"
          aria-label="USJET quick links"
        >
          {GLOBAL_BACKGROUND_BEAT_ENABLED ? (
            <FooterSurpriseWrap chipId="background-beat">
              <SilentHangarAudioToggle className="usjet-global-contact-bar__beat-audio" />
            </FooterSurpriseWrap>
          ) : null}
          <FooterSurpriseWrap chipId="covenant">
            <span className="footer-surprise-wrap--covenant">
              <WefunderCovenantBridge variant="footer" />
            </span>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="b2b">
            <Link
              to="/b2b"
              className="usjet-global-contact-bar__b2b btn-glass glass-effect-interactive"
              title="B2B Enterprise — industrial backbone"
              aria-label="B2B Enterprise gateway"
            >
              <span className="usjet-global-contact-bar__b2b-reflection" aria-hidden />
              <span className="usjet-global-contact-bar__b2b-earth" aria-hidden>
                🌍
              </span>
              <span className="usjet-global-contact-bar__b2b-label">B2B</span>
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="b2k">
            <Link
              to="/b2k"
              className="usjet-global-contact-bar__b2k btn-glass glass-effect-interactive"
              title="B2K — $2,000 enterprise deployment (coming soon)"
              aria-label="B2K enterprise deployment lane"
            >
              <span className="usjet-global-contact-bar__b2k-reflection" aria-hidden />
              <span className="usjet-global-contact-bar__b2k-label">B2K</span>
              <span className="usjet-global-contact-bar__b2k-soon">Soon</span>
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="pdre">
            <Link
              to="/pdre"
              className="usjet-global-contact-bar__pdre btn-glass glass-effect-interactive glass-tint-gold"
              aria-label="Prime Digital Real Estate — strategic partnership application"
              title="Prime Digital Real Estate · Institutional Gateway"
            >
              PDRE
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="blog">
            <Link
              to="/blog"
              className="usjet-global-contact-bar__blog btn-glass glass-effect-interactive glass-tint-cyan"
              title="USJET Operator Log"
              aria-label="USJET blog and operator log"
            >
              Blog
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="gamers">
            <GamingVrNavButton surface="footer" />
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="intel">
            <Link
              to="/intelligence"
              className="usjet-global-contact-bar__intel btn-glass glass-effect-interactive glass-tint-cyan"
              title="USJET Intelligence — three-tier revenue engine"
            >
              Intel
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="manual-25k">
            <Link
              to="/fleet-manual"
              className="usjet-global-contact-bar__25k btn-glass glass-effect-interactive"
              title="2.5K — USJET Fleet Manual · $2,500 Professional Edition"
              aria-label="2.5K — Fleet Manual page"
            >
              <span className="usjet-global-contact-bar__25k-reflection" aria-hidden />
              <span className="usjet-global-contact-bar__25k-cash" aria-hidden>
                💵
              </span>
              <span className="usjet-global-contact-bar__25k-label">2.5K</span>
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="vault-100k">
            <Link
              to="/100k"
              className="usjet-global-contact-bar__100k btn-glass glass-effect-interactive glass-tint-gold"
              title="100K vault — $100,000 until July 4, 2026 · then $500,000"
              aria-label="100K — Sovereign Fleet Protocol vault"
            >
              <span className="usjet-global-contact-bar__100k-reflection" aria-hidden />
              <Gem className="usjet-global-contact-bar__100k-diamond" size={9} strokeWidth={2.4} aria-hidden />
              <span className="usjet-global-contact-bar__100k-label">100K</span>
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="fuel">
            <Link
              to="/founders-fuel"
              className="usjet-global-contact-bar__fuel btn-glass glass-effect-interactive glass-tint-gold"
              title="Founder's Fuel — $19.90/mo"
            >
              Fuel
            </Link>
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="zelle">
            <ZelleFuelChip variant="footer" />
          </FooterSurpriseWrap>
          <FooterSurpriseWrap chipId="licensing">
            <Link
              to="/licensing"
              className="usjet-global-contact-bar__licensing btn-glass glass-effect-interactive glass-tint-gold"
              aria-label="Brand Licensing and Identity — authorized partner application"
              title="Brand Licensing & Identity · Authorized Partner Network"
            >
              <span className="usjet-global-contact-bar__licensing-short">Licensing</span>
              <span className="usjet-global-contact-bar__licensing-full">Brand Licensing</span>
            </Link>
          </FooterSurpriseWrap>
        </nav>
      </GlassEffectContainer>
    </footer>
  );
}
