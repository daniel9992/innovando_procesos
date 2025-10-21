import { MyCenter } from '@src/customAgencyTool/components/ui';
import './fallback.css';

const Fallback = () => {
  return (
    <MyCenter height={'100vh'}>
      <div className="loader">
        <span>Loading...</span>
      </div>
    </MyCenter>
  );
};

export default Fallback;
