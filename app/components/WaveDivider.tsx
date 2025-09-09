type Props = {
  flip?: boolean
  top?: string
  bottom?: string
  className?: string
}

export default function WaveDivider({
  flip,
  top = 'fill-coffeeTan',
  className = '',
}: Props) {
  return (
    <div className={`overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="block w-full h-32"
      >
        <path
          d="
            M0,192
            C240,160 480,224 720,192
            C960,160 1200,96 1440,128
            L1440,192
            C1200,160 960,224 720,256
            C480,288 240,224 0,256
            Z
          "
          className={top}
        />
      </svg>
    </div>
  );
}
