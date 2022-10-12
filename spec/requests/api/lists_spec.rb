require 'rails_helper'

RSpec.describe "Api::Lists", type: :request do
  let(:user) { create(:user) }
  let(:board) { create(:board, user: user) }
  let(:lists) { create_list(:list, 3, board: board) }
  let!(:items) do
    itams = lists.map.with.index do |list, index|
      create_list(:item, 5, list: list, title: "item #{index + 1}")
    end
    items.flatten
  end

  describe "GET index" do
    it "succeeds" do
      get api_board_lists_path(board)
      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response.dig("data").size).to eq(3)


      json_response.dig("data").each do |list_data|
        expect(list_data.dig("relationships", "items", "data").size).to eq(5)
      end
    end
  end
end
