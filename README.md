# Initialization

*For Windows users*
We'll use WSL to code. This is a inbuilt Linux system into your laptop, which allows us to generalize each command.
Execute following lines in an elevated command prompt. (search for `cmd`, right-click and choose `Run as Administrator`)
```bash
wsl --install
```

This installs Ubuntu on your laptop. This will take a while. After the installation, answer the questions to create an account and password.
To run Ubuntu afterwards, just click the shortcut or type `wsl` in your search bar.

## Raspberry Pi
For the sake of simplicity, we're not connecting keyboard etc to the rpi. We'll use SSH instead.

### For Windows users
- Download and install Putty
- Open the program `PuttyGen`
- Click `Generate`
- Insert your name into `Key comment`
- Enter a key passphrase and pake sure to remember it
- Click save *private* key. This is your **personal** key, so don't share it or place it into this repository's folder
- Create a new branch
- Copy the text from the field above (starting with `ssh-rsa`) into the file `rpi/authorized_keys`
- Commit and push the changes and create a pull request

We'll connect to the Rpi using Putty with it's ip address.

### For Mac
- Execute in a Terminal window: `ssh-keygen -t rsa`
- Follow all steps and provide a passphrase
- Create a new branch
- Copy the text from the `id_rsa.pub` file (starting with `ssh-rsa`) into the file `rpi/authorized_keys`, and add your name after it
- Commit and push the changes and create a pull request

To connect to the Rpi, use `ssh admin@ip-address`

## Software
Install nvm to install Node
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install --lts
```

Install Visual Studio Code and a Github manager like Github Desktop or Gitkraken.


# Frontend

## Useful commands
Install all packages
```bash
npm install
```

Bundles the app into static files for production.
```bash
npm run build
```

Start the development server.
```bash
npm start
```

# Backend

## Useful commands
Install all packages
```bash
npm install
```

Bundles the app into static files for production.
```bash
npm run build
```

Start the backend.
```bash
npm start
```