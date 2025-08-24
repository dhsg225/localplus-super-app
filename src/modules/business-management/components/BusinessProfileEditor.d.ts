import React from 'react';
import { BusinessProfile, FormMode } from '../types';
interface BusinessProfileEditorProps {
    mode?: FormMode;
    initialData?: Partial<BusinessProfile>;
}
declare const BusinessProfileEditor: React.FC<BusinessProfileEditorProps>;
export default BusinessProfileEditor;
