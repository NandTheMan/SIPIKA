export default function Title(props) {
    return (
        <h1 className='font-sfprobold text-[96px] font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-[#2D3C93] via-[#537EDC] via-[#659EFF] to-[#659EFF]'>{props.children}</h1>
    );
}