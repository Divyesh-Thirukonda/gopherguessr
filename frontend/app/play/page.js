import EastBankMap from "./_components/EastBankMap";

export default function Play() {
  // since this is nextjs app router this code will not run on the client at all

  // in the future we have a "submit guess" function that does the calculation server side
  const locs = [
    { name: "northrop", lat: 44.97650994493952, lng: -93.23534770592696 },
    { name: "coffman", lat: 44.97292225604155, lng: -93.23535508635577 },
    { name: "3m arena", lat: 44.97816852198272, lng: -93.22794192302824 },
  ];
  const loc = locs[Math.floor(Math.random() * locs.length)];

  return <EastBankMap loc={loc} />;
}
