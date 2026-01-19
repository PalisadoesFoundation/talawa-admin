/*
 * Copyright 2025 Palisadoes Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Button as BootstrapButton, ButtonProps } from 'react-bootstrap';

/**
 * Shared Button Component
 *
 * Wrapper for the Bootstrap button to satisfy linter architecture rules.
 */
const Button = (props: ButtonProps) => {
  // We disable the 'no-explicit-any' rule for this specific line to bypass the type mismatch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BootstrapButton {...(props as any)} />;
};

export default Button;
