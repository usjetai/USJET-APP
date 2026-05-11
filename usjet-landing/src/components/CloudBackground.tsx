export function CloudBackground() {
  return (
    <div aria-hidden="true">
      {/* Liquid mesh base */}
      <div className="liquid-mesh">
        <div className="liquid-mesh__orb liquid-mesh__orb--teal" />
        <div className="liquid-mesh__orb liquid-mesh__orb--violet" />
        <div className="liquid-mesh__orb liquid-mesh__orb--navy" />
        <div className="liquid-mesh__orb liquid-mesh__orb--gold" />
        <div className="liquid-mesh__sheen" />
        <div className="liquid-mesh__noise" />
      </div>

      {/* Flying-through-clouds layers */}
      <div className="cloud-sky">
        {/* Far layer — slow wisps */}
        <div className="cloud-layer cloud-layer--far">
          <div className="cloud cloud--far c-f1" />
          <div className="cloud cloud--far c-f2" />
          <div className="cloud cloud--far c-f3" />
          <div className="cloud cloud--far c-f4" />
          <div className="cloud cloud--far c-f5" />
          <div className="cloud cloud--far c-f6" />
        </div>

        {/* Mid layer */}
        <div className="cloud-layer cloud-layer--mid">
          <div className="cloud cloud--mid c-m1" />
          <div className="cloud cloud--mid c-m2" />
          <div className="cloud cloud--mid c-m3" />
          <div className="cloud cloud--mid c-m4" />
          <div className="cloud cloud--mid c-m5" />
        </div>

        {/* Near layer — fast, large puffs */}
        <div className="cloud-layer cloud-layer--near">
          <div className="cloud cloud--near c-n1" />
          <div className="cloud cloud--near c-n2" />
          <div className="cloud cloud--near c-n3" />
          <div className="cloud cloud--near c-n4" />
        </div>

        {/* Horizon haze */}
        <div className="cloud-horizon" />
      </div>
    </div>
  );
}
