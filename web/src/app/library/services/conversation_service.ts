"use server"

import {Conversation} from "@/app/library/objects/types"

export async function getConversationList(productId: string): Promise<Conversation[]> {
  return []
}

export async function createNewConversation(productId: string, name: string) {
  return
}