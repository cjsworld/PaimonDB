package com.xiaoxi.server.base

import com.xserver.core.util.IntEnum

enum class BoolState(override val value: Int) : IntEnum {
    //禁用
    No(0),

    //启用
    Yes(1)
}
