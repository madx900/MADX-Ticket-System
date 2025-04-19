# Commands Reference

## User Commands

### Ticket Commands
| Command | Description | Usage |
|---------|-------------|--------|
| `/ticket create` | Create a new ticket | `/ticket create [category]` |
| `/ticket close` | Close current ticket | `/ticket close [reason]` |
| `/ticket add` | Add user to ticket | `/ticket add @user` |
| `/ticket remove` | Remove user from ticket | `/ticket remove @user` |

### Shop Commands
| Command | Description | Usage |
|---------|-------------|--------|
| `/cart add` | Add item to cart | `/cart add [item] [quantity]` |
| `/cart view` | View cart contents | `/cart view` |
| `/cart remove` | Remove item from cart | `/cart remove [item]` |
| `/checkout` | Process checkout | `/checkout [payment_method]` |

### Rating Commands
| Command | Description | Usage |
|---------|-------------|--------|
| `/rate` | Rate ticket service | `/rate [stars] [feedback]` |

## Staff Commands

### Ticket Management
| Command | Description | Usage |
|---------|-------------|--------|
| `/ticket claim` | Claim a ticket | `/ticket claim` |
| `/ticket transfer` | Transfer ticket to another staff | `/ticket transfer @staff` |
| `/ticket transcript` | Generate transcript | `/ticket transcript` |

### Admin Commands
| Command | Description | Usage |
|---------|-------------|--------|
| `/blacklist add` | Add user to blacklist | `/blacklist add @user [reason]` |
| `/blacklist remove` | Remove user from blacklist | `/blacklist remove @user` |
| `/embed` | Create custom embed | `/embed [title] [description]` |

## Permission Requirements

- User commands: No special permissions required
- Staff commands: Require staff role
- Admin commands: Require admin role

See [Configuration Guide](Configuration) for role setup.
