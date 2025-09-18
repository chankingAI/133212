#!/bin/bash

echo "🚀 启动全栈网站项目..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 MongoDB 是否运行
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB 未运行，正在尝试启动..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    else
        echo "❌ 无法自动启动 MongoDB，请手动启动"
        exit 1
    fi
fi

# 安装依赖
echo "📦 安装依赖..."
npm run install-all

# 启动应用
echo "🎉 启动应用..."
npm run dev