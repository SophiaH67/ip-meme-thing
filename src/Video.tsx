import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import './style.css';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={30 * 8}
				fps={30}
				width={720}
				height={720}
			/>
		</>
	);
};
