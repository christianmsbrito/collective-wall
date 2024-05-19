class Artist < ApplicationRecord
  has_many :styles, as: :styleable
  has_many :themes, as: :themeable
  has_many :mediums, as: :mediable
  has_many :compositions, as: :composable
end
