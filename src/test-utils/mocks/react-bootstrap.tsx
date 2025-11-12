/**
 * Test utilities shim for `react-bootstrap` used by unit tests.
 *
 * The real library provides many complex components; for unit tests we only
 * need a tiny, predictable subset. This module re-exports a lightweight
 * `Dropdown` mock that exposes `Toggle`, `Menu` and `Item` subcomponents.
 */

export { Dropdown } from './react-bootstrap/Dropdown';
