const { exec } = require('child_process');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const command = req.body.command;

        const allowedCommands = [
            'ls',
            'mkdir',
            'rm',
            'echo',
            'clear'
        ];

        // Check if the command is allowed
        if (!allowedCommands.some(cmd => command.startsWith(cmd))) {
            return res.status(403).send('Command not allowed\nuser@infinitee -$ ');
        }

        // Handle the 'clear' command
        if (command === 'clear') {
            return res.send('user@infinitee -$ '); // Return just the prompt after clearing
        }

        // Execute the command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).send(`Error: ${error.message}\nuser@infinitee -$ `);
            }
            if (stderr) {
                return res.status(500).send(`Stderr: ${stderr}\nuser@infinitee -$ `);
            }

            // Trim the output and remove any empty lines
            const output = stdout.split('\n').map(line => line.trim()).filter(line => line).join('\n');

            // Send the output and append the prompt without extra newlines
            res.send(output ? output + '\nuser@infinitee -$ ' : 'user@infinitee -$ ');
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
