import paramiko

def run_ssh_command(host, user, password, command):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        stdin, stdout, stderr = client.exec_command(command)
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        print(f"STDOUT:\n{out}")
        print(f"STDERR:\n{err}")
    finally:
        client.close()

if __name__ == "__main__":
    host = "103.27.207.70"
    user = "root"
    password = "l%%1oig01vJ9"
    cmd = "systemctl list-units --type=service | grep -i velvi ; ls -la /etc/systemd/system | grep -i velvi ; cd /var/www/backend && ls -la && git status ; cd /var/www/frontend && ls -la && git status"
    run_ssh_command(host, user, password, cmd)
