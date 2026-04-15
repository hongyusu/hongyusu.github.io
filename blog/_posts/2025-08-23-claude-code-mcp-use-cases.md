---
layout: blog-post
title: "Claude Code + MCP: AI Development with Bedrock"
date: 2025-08-23
categories: [blog]
tags: [AI, Claude, MCP, Development, Automation, AWS, Bedrock]
excerpt: "A practical guide to setting up Claude Code with AWS Bedrock and MCP servers to create an AI-powered development environment that integrates with GitHub, Jira, Confluence, and Slack."
---

Claude Code is a command-line AI assistant that transforms developer workflows by integrating with your existing tools. Using Anthropic's state-of-the-art Claude 4 models through AWS Bedrock, it creates a unified, context-aware workspace for coding, documentation, and project management.

## Setup: Claude Code with AWS Bedrock

### Prerequisites
1. **Install Claude CLI**: Follow the [official quickstart guide](https://docs.anthropic.com/en/docs/claude-code/quickstart)
2. **AWS Authentication**: Access to `cambri-datascience-dev` account with proper credentials

### Configuration
Set these environment variables in your `.bashrc` or `.zshrc`:

```bash
# Enable Bedrock integration
export CLAUDE_CODE_USE_BEDROCK=1
export ANTHROPIC_MODEL="eu.anthropic.claude-sonnet-4-20250514-v1:0"
export AWS_DEFAULT_REGION="eu-west-1"

# AWS Profile setup
export AWS_PROFILE="DSDEV"
```

### Authentication
```bash
# Login to AWS SSO
aws sso login

# Launch Claude Code
claude
```

**Test**: Say "hi" to verify the connection (avoid "test" as it may trigger unit test generation).

## MCP Server Integration

Extend Claude's capabilities by connecting to development tools:

| **Service** | **MCP Server Package** |
|-------------|----------------------|
| Jira | `@aashari/mcp-server-atlassian-jira` |
| Confluence | `@aashari/mcp-server-atlassian-confluence` |
| GitHub | `@missionsquad/mcp-github` |
| Slack | `@modelcontextprotocol/server-slack` |
| AWS Docs | `awslabs.aws-documentation-mcp-server@latest` |

## Key Use Cases

### 1. Code Development
- **Feature Implementation**: *"Implement the API described in Jira ticket ENG-123 and create a PR"*
- **Code Reviews**: Automated security scanning and vulnerability detection on pull requests
- **Documentation**: Auto-sync code changes with README and Confluence pages

### 2. Project Management  
- **Ticket Queries**: *"What's the status of our current sprint?"*
- **Bulk Operations**: Create multiple sub-tasks from requirements automatically
- **Sprint Reports**: Generate and distribute sprint summaries via Slack

### 3. Communication & Knowledge
- **Slack Integration**: Query Jira/Confluence directly from team chat
- **Document Search**: *"What are our password complexity requirements?"*
- **Debugging**: Cross-reference error logs, code, and documentation for root cause analysis

## IDE Integration

Claude Code integrates with popular development environments:

- **JetBrains IDEs**: PyCharm, WebStorm, IntelliJ IDEA via [official plugin](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-)
- **VS Code**: Auto-installs when running `claude` from the terminal
- **Terminal**: Full CLI interface for any development setup

## Security & Data Handling

- **Local Processing**: Runs entirely in your terminal, no remote code indexing
- **AWS Bedrock**: Models invoked through existing AWS data agreements
- **Direct API**: No third-party backend servers required

## Example Workflow

1. **Requirements**: Jira story describes new feature  
2. **Implementation**: *"Claude, implement this feature"*
3. **Testing**: Auto-generated unit tests
4. **Review**: AI security scan on PR
5. **Documentation**: Update Confluence with feature details
6. **Communication**: Notify team in Slack

All through natural language, eliminating context switching between tools.

## Benefits

- **Reduced Context Switching**: Access all tools through one interface
- **Automated Security**: AI catches vulnerabilities before merge
- **Faster Debugging**: Multi-source error analysis
- **Living Documentation**: Code and docs stay in sync
- **Team Communication**: Project data accessible via Slack

## Getting Started

Claude Code + MCP transforms development into a conversational workflow. Instead of juggling multiple tools, developers interact with their entire tech stack through natural language, creating a truly context-aware development environment.

*Experience from implementing AI-powered development workflows with Claude Code and AWS Bedrock.*