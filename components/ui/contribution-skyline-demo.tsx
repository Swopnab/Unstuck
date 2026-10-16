import ContributionSkyline, {type ContributionDay} from './contribution-skyline';
export default function ContributionSkylineDemo({data=[]}:{data?:ContributionDay[]}) {return <ContributionSkyline data={data} endDate={new Date()} unit="minute" unitPlural="minutes" palette="github" title="Your recorded study activity"/>;}
