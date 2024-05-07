import { CrossPreset } from '../constants';
import './Configurator.css';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

interface SmallCrossInCartItemProps {
  json_string: string;
}

//display bigcorss customization parts in cart item
//
const SmallCrossInCartItem: React.FC<SmallCrossInCartItemProps> = ({ json_string }) => {
  //console.log(json_string);
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'legod');

  if (!json_string) {
    return <></>;
  }

  let preset = JSON.parse(json_string) as CrossPreset;

  const parts = preset.parts.map((part, index) => ({
    key: `${index}`,
    name: `${part.name}`,
    color: `${part.color.color}`,
  }));

  return (
    parts.length > 0 && (
      <div className="w-full">
        <div className="grid grid-row-5 grid-flow-col auto-cols-max gap-2">
          <div className="row-span-5 col-span-5 text-xs">
            {t('cartItem_words')}
            <br />
            {preset.words}
          </div>

          {parts.map((part, index) => (
            <div key={index} className="w-18 h-18 p-1" style={{ backgroundColor: part.color }}>
              <div className="place-content-center text-[9px]">{part.name}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
export default SmallCrossInCartItem;
