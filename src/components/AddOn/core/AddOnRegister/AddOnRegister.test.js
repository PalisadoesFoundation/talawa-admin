import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import AddOnRegister from './AddOnRegister';

describe("Testing AddOnRegister", () => {
  const props = {
    id: '6234d8bf6ud937ddk70ecc5c9'
  };

  test("should render modal and take info to add plugin for registered organization", () => {
    render(
      <AddOnRegister {...props}/>
    ) 
    userEvent.click(screen.getByRole('button', { name: /add new/i}));
    userEvent.type(screen.getByPlaceholderText("Plugin Name"), "myplugin");
    userEvent.type(screen.getByTitle("Plugin Description"), "myplugin description");
    userEvent.type(screen.getByPlaceholderText("Plugin Repo (GitHub URL)"), "https://github.com/PalisadoesFoundation/talawa-admin");
    userEvent.click(screen.getByLabelText("Install after register."));
    userEvent.click(screen.getByTestId('addonregister'));
    userEvent.click(screen.getByTestId('addonclose'));
    
    expect(screen.getByPlaceholderText("Plugin Name")).toHaveValue("myplugin");
    expect(screen.getByTitle("Plugin Description")).toHaveValue("myplugin description");
    expect(screen.getByPlaceholderText("Plugin Repo (GitHub URL)")).toHaveValue("https://github.com/PalisadoesFoundation/talawa-admin");
    expect(screen.getByLabelText("Install after register.")).toBeChecked();
  })

})