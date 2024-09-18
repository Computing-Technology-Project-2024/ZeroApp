import SideBar from '../components/sideBars/SideBar';
import BaseCard from '../components/cards/BaseCard';
import SolarStatus from '../components/charts/SolarStatus';


const dashboard = () => {
    return (
        <div>
            <p className='head'>Dashboard</p>

            <BaseCard width={150} height={100}>
            <SolarStatus/>
            </BaseCard>
            
        </div>
    )
}
export default dashboard;